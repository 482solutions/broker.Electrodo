const currentDate = new Date()  ;
const utcOffsetInMinutes = currentDate.getTimezoneOffset();

// Adjust the date and time to UTC+0
const currentDateInUTC0 = new Date(currentDate.getTime() + utcOffsetInMinutes * 60 * 1000);
const currentDateInSeconds = Math.floor(currentDateInUTC0.getTime()/1000);

const expirationDate = currentDateInUTC0.setFullYear(currentDateInUTC0.getFullYear() + 1);
const expirationDateInSeconds = Math.floor(expirationDate/1000);

const baseDelegationPolicy = {
    "delegationEvidence": {
        "notBefore": currentDateInSeconds,
        "notOnOrAfter": expirationDateInSeconds,
        "policyIssuer": "482.client_id",
        "target": {
            "accessSubject": "uausc.client_id"
        },
        "policySets": [
            {
                "target": {
                    "environment": {
                        "licenses": [
                            "ISHARE.0001"
                        ]
                    }
                },
                "policies": [
                    {
                        "target": {
                            "resource": {
                                "type": "EnergyConsumption",
                                "identifiers": [
                                    "*"
                                ],
                                "attributes": [
                                    "*"
                                ]
                            },
                            "actions": [
                                "GET"
                            ]
                        },
                        "rules": [
                            {
                                "effect": "Permit"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
export default baseDelegationPolicy;
