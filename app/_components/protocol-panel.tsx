import { Tabs } from "../common/tabs";
import { Visualizer } from "../common/visualizer";
import { Code } from "../common/code";
import { type ParsedVPToken } from "../lib/util";

export function ProtocolPanel({
  presentation,
  requestParams,
  endpoint,
}: {
  presentation: ParsedVPToken | null;
  requestParams: Record<string, string>;
  endpoint: string;
}) {
  const credentialIds = presentation ? Object.keys(presentation) : [];

  return (
    <Tabs
      selectedTab={presentation ? "presentation" : "request"}
      tabs={[
        {
          key: "request",
          label: "Request",
          content: (
            <div className="flex flex-col gap-6 pt-2">
              <div>
                <p className="mb-2 text-sm font-bold">Request endpoint:</p>
                <Code label="Authorization endpoint URL">{endpoint}</Code>
              </div>
              <div>
                <p className="mb-2 text-sm font-bold">Request payload:</p>
                <Visualizer data={requestParams} />
              </div>
            </div>
          ),
        },
        {
          key: "presentation",
          label: "Presentation",
          content: (
            <div className="flex flex-col gap-6 pt-2">
              {credentialIds.map((credentialId) =>
                presentation![credentialId].map((parsed, idx) => (
                  <div
                    key={`${credentialId}-${idx}`}
                    className="flex flex-col gap-6"
                  >
                    {(credentialIds.length > 1 ||
                      presentation![credentialId].length > 1) && (
                      <p className="text-sm font-bold text-gray-400">
                        {credentialId}
                        {presentation![credentialId].length > 1
                          ? ` [${idx + 1}]`
                          : ""}
                      </p>
                    )}
                    <div>
                      <p className="mb-2 text-sm font-bold">VC Payload</p>
                      <Visualizer data={parsed.vcPayload} />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-bold">Disclosures</p>
                      <Visualizer data={parsed.disclosures} />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-bold">Key Binding JWT</p>
                      <Visualizer data={parsed.kbJwtPayload ?? null} />
                    </div>
                  </div>
                )),
              )}
            </div>
          ),
        },
      ]}
    />
  );
}
