import type { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("OBx Platform")
    .items([
      S.listItem()
        .title("Intake submissions")
        .id("intakes")
        .child(
          S.documentTypeList("intake")
            .title("Intake submissions")
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
        ),
      S.listItem()
        .title("Client projects")
        .id("client-projects")
        .child(
          S.documentTypeList("clientProject")
            .title("Client projects")
            .defaultOrdering([{ field: "slug", direction: "asc" }]),
        ),
    ]);
