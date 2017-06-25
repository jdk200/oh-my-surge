import nock from "nock";
import plugin from "./aws.plugin";

const fixture = {
  successfulReply: `{
  "syncToken": "1498169531",
  "createDate": "2017-06-22-22-12-11",
  "prefixes": [
    {
      "ip_prefix": "13.32.0.0/15",
      "region": "GLOBAL",
      "service": "AMAZON"
    },
    {
      "ip_prefix": "13.52.0.0/15",
      "region": "ca-central-1",
      "service": "AMAZON"
    }
  ],
  "ipv6_prefixes": [
    {
      "ipv6_prefix": "2400:6500:0:7000::/56",
      "region": "ap-southeast-1",
      "service": "AMAZON"
    }
  ]
}`,
  singleProxySuccessfulRules: `IP-CIDR,13.32.0.0/15,Proxy
IP-CIDR,13.52.0.0/15,Proxy`
};

describe("plugin", () => {
  const { fetch, process } = plugin();
  describe("fetch", () => {
    afterEach(() => {
      nock.cleanAll();
    });
    it("should fetch gfwlist when the http request succeeds", () => {
      nock("https://ip-ranges.amazonaws.com")
        .get("/ip-ranges.json")
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
