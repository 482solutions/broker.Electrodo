import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

export const defaultPolicies = [
    {
        "delegationEvidence": {
            "notBefore": 1684843795,
            "notOnOrAfter": 1799298267,
            "policyIssuer": "EU.EORI.UA482SOL",
            "target": { "accessSubject": process.env.ACCESS_SUBJECT_1 },
            "policySets": [{
                "target": { "environment": { "licenses": ["ISHARE.0002"] } },
                "policies": [{
                    "target": {
                        "resource": {
                            "type": "EnergyConsumption",
                            "identifiers": ["urn:ngsi-ld:EnergyConsumption:private1693387872862x9981154737153638002023"],
                            "attributes": ["*"]
                        },
                        "actions": ["GET", "POST", "PATCH"]
                    },
                    "rules": [{ "effect": "Permit" }]
                }]
            }]
        }
    },
    {
        "delegationEvidence": {
            "notBefore": 1684843795,
            "notOnOrAfter": 1799298267,
            "policyIssuer": "EU.EORI.UA482SOL",
            "target": { "accessSubject": process.env.ACCESS_SUBJECT_2},
            "policySets": [{
                "target": { "environment": { "licenses": ["ISHARE.0002"] } },
                "policies": [{
                    "target": {
                        "resource": {
                            "type": "EnergyConsumption",
                            "identifiers": ["urn:ngsi-ld:EnergyConsumption:private1692012529967x9681339860385792002023"],
                            "attributes": ["*"]
                        },
                        "actions": ["GET", "POST", "PATCH"]
                    },
                    "rules": [{ "effect": "Permit" }]
                }]
            }]
        }
    },
    {
        "delegationEvidence": {
            "notBefore": 1684843795,
            "notOnOrAfter": 1799298267,
            "policyIssuer": "EU.EORI.UA482SOL",
            "target": { "accessSubject": process.env.ACCESS_SUBJECT_3 },
            "policySets": [{
                "target": { "environment": { "licenses": ["ISHARE.0002"] } },
                "policies": [{
                    "target": {
                        "resource": {
                            "type": "EnergyConsumption",
                            "identifiers": ["urn:ngsi-ld:EnergyConsumption:private1692012591070x8165219819470193002023"],
                            "attributes": ["*"]
                        },
                        "actions": ["GET", "POST", "PATCH"]
                    },
                    "rules": [{ "effect": "Permit" }]
                }]
            }]
        }
    },
    {
        "delegationEvidence": {
            "notBefore": 1684843795, "notOnOrAfter": 1799298267, "policyIssuer": "EU.EORI.UA482SOL", "target": { "accessSubject": "EU.EORI.SPE" },
            "policySets": [{
                "target": { "environment": { "licenses": ["ISHARE.0002"] } },
                "policies": [{
                    "target":
                    {
                        "resource":
                        {
                            "type": "EnergyConsumption",
                            "identifiers":
                                [
                                    "urn:ngsi-ld:EnergyConsumption:private1692012591070x8165219819470193002023",
                                    "urn:ngsi-ld:EnergyConsumption:private1693387872862x9981154737153638002023",
                                    "urn:ngsi-ld:EnergyConsumption:private1692012529967x9681339860385792002023"
                                ],
                            "attributes": ["*"]
                        }, "actions": ["GET", "POST", "PATCH"]
                    }, "rules": [{ "effect": "Permit" }]
                }]
            }]
        }
    }

]