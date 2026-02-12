import { parseRequestQuery, constructPreparedStatement } from "./utils.js";

const model = {
  table: "Evidence",
  idField: "EvidenceID",
  mutableFields: [
    "EvidenceDescription",
    "EvidenceAnnotationID",
    "EvidenceEvidencetypeID",
    "EvidenceURL",
    "EvidenceFilename",
    "EvidenceFilepath",
  ],

  buildReadQuery: (req, variant) => {
    // Initialisations ------------------------
    let [table, fields] = [
      model.table,
      [model.idField, ...model.mutableFields],
    ];

    // Resolve Foreign Keys -------------------
    table = `(${table} INNER JOIN Annotations ON Evidence.EvidenceAnnotationID=Annotations.AnnotationID INNER JOIN Evidencetypes ON Evidence.EvidenceEvidencetypeID=Evidencetypes.EvidencetypeID)`;
    fields = [
      ...fields,
      "EvidenceCreated",
      "EvidencetypeName",
      "AnnotationDescription",
    ];

    // Process request queries ----------------
    const allowedQueryFields = [
      ...model.mutableFields,
      "EvidenceCreated",
      "EvidencetypeName",
      "AnnotationDescription",
    ];
    const [filter, orderby] = parseRequestQuery(req, allowedQueryFields);

    // Construct prepared statement -----------
    let where = null;
    let parameters = {};
    switch (variant) {
      case "primary":
        where = "EvidenceID=:ID";
        parameters = { ID: parseInt(req.params.id) };
        break;
      case "annotations":
        where = "EvidenceAnnotationID=:ID";
        parameters = { ID: parseInt(req.params.id) };
        break;
    }

    return constructPreparedStatement(
      fields,
      table,
      where,
      parameters,
      filter,
      orderby,
    );
  },
};

export default model;
