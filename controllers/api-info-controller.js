const showApiInfo = async (req, res) => {
  res.status(200).json({
    message: "List of available endpoints",
    listOfEndpoints: [
      {
        entity: "Claims",
        sap: "/api/claims",
        services: {
          get: [
            {
              endpoint: "/",
              description: "Returns all claims",
              examples: ["/api/claims"],
            },
            {
              endpoint: "/{id}",
              description:
                "Returns the specific claim identified by the id provided",
              examples: ["/api/claims/1"],
            },
            {
              endpoint: "/users/{id}",
              description:
                "Returns the set of claims associated with the user identified by the id provided",
              examples: ["/api/claims/users/1"],
            },
            {
              endpoint: "/claimstatus/{id}",
              description:
                "Returns the set of claims associated with the claim status identified by the id provided",
              examples: ["/api/claims/claimstatus/1"],
            },
          ],
          post: {
            endpoint: "/",
            description: "Insert a new claim",
          },
          put: {
            endpoint: "/{id}",
            description:
              "Update the specific claim identified by the id provided",
          },
          delete: {
            endpoint: "/{id}",
            description:
              "Delete the specific claim identified by the id provided",
          },
        },
      },
      {
        entity: "Sources",
        sap: "/api/sources",
        services: {
          get: [
            {
              endpoint: "/",
              description: "Returns all sources",
              examples: ["/api/sources"],
            },
            {
              endpoint: "/{id}",
              description:
                "Returns the specific source identified by the id provided",
              examples: ["/api/sources/1"],
            },
            {
              endpoint: "/claims/{id}",
              description:
                "Returns the set of sources associated with the claim identified by the id provided",
              examples: ["/api/sources/claims/1"],
            },
          ],
          post: {
            endpoint: "/",
            description: "Insert a new source (supports file upload)",
          },
          put: {
            endpoint: "/{id}",
            description:
              "Update the specific source identified by the id provided (supports file upload)",
          },
          delete: {
            endpoint: "/{id}",
            description:
              "Delete the specific source identified by the id provided",
          },
        },
      },
      {
        entity: "Source Types",
        sap: "/api/sourcetypes",
        services: {
          get: [
            {
              endpoint: "/",
              description: "Returns all source types",
              examples: ["/api/sourcetypes"],
            },
            {
              endpoint: "/{id}",
              description:
                "Returns the specific source type identified by the id provided",
              examples: ["/api/sourcetypes/1"],
            },
          ],
          post: {
            endpoint: "/",
            description: "Insert a new source type",
          },
          put: {
            endpoint: "/{id}",
            description:
              "Update the specific source type identified by the id provided",
          },
          delete: {
            endpoint: "/{id}",
            description:
              "Delete the specific source type identified by the id provided",
          },
        },
      },
      {
        entity: "Users",
        sap: "/api/users",
        services: {
          get: [
            {
              endpoint: "/",
              description: "Returns all users",
              examples: ["/api/users"],
            },
            {
              endpoint: "/{id}",
              description:
                "Returns the specific user identified by the id provided",
              examples: ["/api/users/1"],
            },
            {
              endpoint: "/usertypes/{id}",
              description:
                "Returns the set of users associated with the user type identified by the id provided",
              examples: ["/api/users/usertypes/1"],
            },
          ],
          post: {
            endpoint: "/",
            description: "Insert a new user",
          },
          put: {
            endpoint: "/{id}",
            description:
              "Update the specific user identified by the id provided",
          },
          delete: {
            endpoint: "/{id}",
            description:
              "Delete the specific user identified by the id provided",
          },
        },
      },
      {
        entity: "User Types",
        sap: "/api/usertypes",
        services: {
          get: [
            {
              endpoint: "/",
              description: "Returns all user types",
              examples: ["/api/usertypes"],
            },
            {
              endpoint: "/{id}",
              description:
                "Returns the specific user type identified by the id provided",
              examples: ["/api/usertypes/1"],
            },
          ],
          post: {
            endpoint: "/",
            description: "Insert a new user type",
          },
          put: {
            endpoint: "/{id}",
            description:
              "Update the specific user type identified by the id provided",
          },
          delete: {
            endpoint: "/{id}",
            description:
              "Delete the specific user type identified by the id provided",
          },
        },
      },
      {
        entity: "Assignments",
        sap: "/api/assignments",
        services: {
          get: [
            {
              endpoint: "/",
              description: "Returns all assignments",
              examples: ["/api/assignments"],
            },
            {
              endpoint: "/{id}",
              description:
                "Returns the specific assignment identified by the id provided",
              examples: ["/api/assignments/1"],
            },
            {
              endpoint: "/users/{id}",
              description:
                "Returns the set of assignments associated with the user identified by the id provided",
              examples: ["/api/assignments/users/1"],
            },
            {
              endpoint: "/claims/{id}",
              description:
                "Returns the set of assignments associated with the claim identified by the id provided",
              examples: ["/api/assignments/claims/1"],
            },
          ],
          post: {
            endpoint: "/",
            description: "Insert a new assignment",
          },
          put: {
            endpoint: "/{id}",
            description:
              "Update the specific assignment identified by the id provided",
          },
          delete: {
            endpoint: "/{id}",
            description:
              "Delete the specific assignment identified by the id provided",
          },
        },
      },
      {
        entity: "Evidence",
        sap: "/api/evidence",
        services: {
          get: [
            {
              endpoint: "/",
              description: "Returns all evidence",
              examples: ["/api/evidence"],
            },
            {
              endpoint: "/{id}",
              description:
                "Returns the specific evidence identified by the id provided",
              examples: ["/api/evidence/1"],
            },
            {
              endpoint: "/annotations/{id}",
              description:
                "Returns the set of evidence associated with the annotation identified by the id provided",
              examples: ["/api/evidence/annotations/1"],
            },
          ],
          post: {
            endpoint: "/",
            description: "Insert a new evidence record (supports file upload)",
          },
          put: {
            endpoint: "/{id}",
            description:
              "Update the specific evidence identified by the id provided (supports file upload)",
          },
          delete: {
            endpoint: "/{id}",
            description:
              "Delete the specific evidence identified by the id provided",
          },
        },
      },
      {
        entity: "Evidence Types",
        sap: "/api/evidencetypes",
        services: {
          get: [
            {
              endpoint: "/",
              description: "Returns all evidence types",
              examples: ["/api/evidencetypes"],
            },
            {
              endpoint: "/{id}",
              description:
                "Returns the specific evidence type identified by the id provided",
              examples: ["/api/evidencetypes/1"],
            },
          ],
          post: {
            endpoint: "/",
            description: "Insert a new evidence type",
          },
          put: {
            endpoint: "/{id}",
            description:
              "Update the specific evidence type identified by the id provided",
          },
          delete: {
            endpoint: "/{id}",
            description:
              "Delete the specific evidence type identified by the id provided",
          },
        },
      },
      {
        entity: "Annotations",
        sap: "/api/annotations",
        services: {
          get: [
            {
              endpoint: "/",
              description: "Returns all annotations",
              examples: ["/api/annotations"],
            },
            {
              endpoint: "/{id}",
              description:
                "Returns the specific annotation identified by the id provided",
              examples: ["/api/annotations/1"],
            },
            {
              endpoint: "/users/{id}",
              description:
                "Returns the set of annotations associated with the user identified by the id provided",
              examples: ["/api/annotations/users/1"],
            },
            {
              endpoint: "/claims/{id}",
              description:
                "Returns the set of annotations associated with the claim identified by the id provided",
              examples: ["/api/annotations/claims/1"],
            },
          ],
          post: {
            endpoint: "/",
            description: "Insert a new annotation",
          },
          put: {
            endpoint: "/{id}",
            description:
              "Update the specific annotation identified by the id provided",
          },
          delete: {
            endpoint: "/{id}",
            description:
              "Delete the specific annotation identified by the id provided",
          },
        },
      },
    ],
  });
};

export default showApiInfo;
