import { parseRequestQuery, constructPreparedStatement } from "./utils.js";

const model = {
  table: "Feedback",
  idField: "FeedbackID",
  mutableFields: ["FeedbackScore", "FeedbackComment", "FeedbackAssignmentID"],

  buildReadQuery: (req, variant) => {
    let [table, fields] = [
      model.table,
      [model.idField, ...model.mutableFields],
    ];

    table = `(${table}
      INNER JOIN Assignments ON Feedback.FeedbackAssignmentID = Assignments.AssignmentID
      INNER JOIN Users ON Assignments.AssignmentUserID = Users.UserID
      INNER JOIN Claims ON Assignments.AssignmentClaimID = Claims.ClaimID
    )`;

    fields = [
      ...fields,
      "FeedbackCreated",
      "Users.UserID AS FeedbackUserID",
      "CONCAT(Users.UserFirstname, ' ', Users.UserLastname) AS FeedbackUsername",
      "Claims.ClaimID AS FeedbackClaimID",
      "Claims.ClaimTitle AS FeedbackClaimTitle",
    ];

    const allowedQueryFields = [
      ...model.mutableFields,
      "FeedbackCreated",
      "FeedbackUserID",
      "FeedbackClaimID",
    ];
    const [filter, orderby] = parseRequestQuery(req, allowedQueryFields);

    let where = null;
    let parameters = {};
    switch (variant) {
      case "primary":
        where = "FeedbackID=:ID";
        parameters = { ID: parseInt(req.params.id) };
        break;
      case "assignments":
        where = "Feedback.FeedbackAssignmentID=:ID";
        parameters = { ID: parseInt(req.params.id) };
        break;
      case "users":
        where = "Assignments.AssignmentUserID=:ID";
        parameters = { ID: parseInt(req.params.id) };
        break;
      case "claims":
        where = "Claims.ClaimID=:ID";
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
