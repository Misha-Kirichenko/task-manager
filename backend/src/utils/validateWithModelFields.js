const { UUID } = require("@constants/regex");

const validateWithModelFields = (value, type) => {
  switch (type.key) {
    case "STRING":
    case "TEXT":
      return typeof value === "string";

    case "INTEGER":
      return Number.isInteger(value);

    case "BIGINT":
      return typeof value === "number" && Number.isSafeInteger(value);

    case "FLOAT":
    case "DOUBLE":
    case "REAL":
      return typeof value === "number";

    case "BOOLEAN":
      return typeof value === "boolean";

    case "DATE":
      return !isNaN(Date.parse(value));

    case "UUID":
      return UUID.test(value);

    case "ARRAY":
      return Array.isArray(value);

    case "JSON":
    case "JSONB":
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }

    case "ENUM":
      return type.values.includes(value);

    default:
      return true;
  }
}


module.exports = validateWithModelFields;