import "isomorphic-fetch";

export default function(config) {
  return {
    async fetch() {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt"
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
      const content = Buffer.from(result, "base64").toString();
      const commentPattern = /^\!|\[|^@@|^\d+\.\d+\.\d+\.\d+/;
      const domainPattern = /([\w\-\_]+\.[\w\.\-\_]+)[\/\*]*/;
      const domainSet = content
        .split("\n")
        .filter(l => !commentPattern.test(l))
        .reduce((set, l) => {
          const domain = domainPattern.exec(l);
          if (domain !== null) {
            set.add(domain[1]);
          }
          return set;
        }, new Set());
      return [...domainSet]
        .map(domain => `DOMAIN-SUFFIX,${domain},Proxy,force-remote-dns`)
        .join("\n");
    }
  };
}
