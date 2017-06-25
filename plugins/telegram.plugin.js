import "isomorphic-fetch";

export default function(config) {
  return {
    async fetch() {
      try {
        const response = await fetch(
          "https://stat.ripe.net/data/announced-prefixes/data.json?resource=AS62041"
        );
        if (response.status === 200) {
          return response.text();
        }
        console.error(response);
      } catch (err) {
        console.error(err);
      }
      return null;
    },
    process(result) {
      const content = JSON.parse(result);
      return content.data.prefixes
        .filter(({ prefix }) => !prefix.includes(":"))
        .map(({ prefix }) => `IP-CIDR,${prefix},Proxy`)
        .join("\n");
    }
  };
}
