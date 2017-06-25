import nock from "nock";
import plugin from "./gfwlist.plugin";
import fixture from "./gfwlist.plugin.fixture.json";

describe("plugin", () => {
  const { fetch, process } = plugin();
  describe("fetch", () => {
    afterEach(() => {
      nock.cleanAll();
    });
    it("should fetch gfwlist when the http request succeeds", () => {
      nock("https://raw.githubusercontent.com")
        .get("/gfwlist/gfwlist/master/gfwlist.txt")
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
