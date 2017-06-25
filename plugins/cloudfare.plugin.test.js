import nock from "nock";
import plugin from "./cloudfare.plugin";

const fixture = {
  successfulReply: `103.21.244.0/22
103.22.200.0/22
`,
  singleProxySuccessfulRules: `IP-CIDR,103.21.244.0/22,Proxy
IP-CIDR,103.22.200.0/22,Proxy`
};

describe("plugin", () => {
  const { fetch, process } = plugin();
  describe("fetch", () => {
    afterEach(() => {
      nock.cleanAll();
    });
    it("should fetch gfwlist when the http request succeeds", () => {
      nock("https://www.cloudflare.com")
        .get("/ips-v4")
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
