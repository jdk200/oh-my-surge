import nock from "nock";
import plugin from "./telegram.plugin";

const fixture = {
  successfulReply: `{
    "status": "ok", 
    "server_id": "stat-app13", 
    "status_code": 200, 
    "version": "1.2", 
    "cached": false, 
    "see_also": [], 
    "time": "2017-06-25T05:24:19.816454", 
    "messages": [
        [
            "info", 
            "Results exclude routes with very low visibility (less than 3 RIS full-feed peers seeing)."
        ]
    ], 
    "data_call_status": "supported - connecting to ursa", 
    "process_time": 40, 
    "build_version": "2017.6.23.214", 
    "query_id": "8a2be2fa-5966-11e7-8702-00505688ee07", 
    "data": {
        "resource": "62041", 
        "prefixes": [
            {
                "timelines": [
                    {
                        "endtime": "2017-06-25T00:00:00", 
                        "starttime": "2017-06-11T00:00:00"
                    }
                ], 
                "prefix": "149.154.160.0/20"
            }, 
            {
                "timelines": [
                    {
                        "endtime": "2017-06-25T00:00:00", 
                        "starttime": "2017-06-11T00:00:00"
                    }
                ], 
                "prefix": "2001:67c:4e8::/48"
            }, 
            {
                "timelines": [
                    {
                        "endtime": "2017-06-25T00:00:00", 
                        "starttime": "2017-06-11T00:00:00"
                    }
                ], 
                "prefix": "91.108.56.0/22"
            }
        ], 
        "query_starttime": "2017-06-11T00:00:00", 
        "latest_time": "2017-06-25T00:00:00", 
        "query_endtime": "2017-06-25T00:00:00", 
        "earliest_time": "2000-08-01T00:00:00"
    }
}`,
  singleProxySuccessfulRules: `IP-CIDR,149.154.160.0/20,Proxy
IP-CIDR,91.108.56.0/22,Proxy`
};

describe("plugin", () => {
  const { fetch, process } = plugin();
  describe("fetch", () => {
    afterEach(() => {
      nock.cleanAll();
    });
    it("should fetch gfwlist when the http request succeeds", () => {
      nock("https://stat.ripe.net")
        .get("/data/announced-prefixes/data.json?resource=AS62041")
        .reply(200, fixture.successfulReply);
      expect(fetch()).resolves.toEqual(fixture.successfulReply);
    });
  });
  describe("process", () => {
    it("should work", () => {
      const rules = process(fixture.successfulReply);
      expect(rules).toEqual(fixture.singleProxySuccessfulRules);
    });
  });
});
