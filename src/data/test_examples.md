# API Test Examples

Here are some high-quality API request examples you can use to test the **API Tester** workspace.

---

## 1. Product Search (GET)
Use this to test how the dashboard handles multiple query parameters and lists of data.

*   **URL:** `https://dummyjson.com/products/search`
*   **Method:** `GET`
*   **Params:**
    ```text
    q=phone
    limit=5
    skip=0
    ```
*   **Headers:** `Accept: application/json`

---

## 2. Update Profile (PUT)
Use this to test nested JSON editing and the `PUT` method.

*   **URL:** `https://reqres.in/api/users/2`
*   **Method:** `PUT`
*   **Headers:** `Content-Type: application/json`
*   **Body:**
    ```json
    {
      "name": "Arjun Tech",
      "job": "Lead Engineer",
      "metadata": {
        "focus": "Security",
        "active": true
      }
    }
    ```

---

## 3. Authentication Flow (POST)
Use this to test custom headers (like Authorization) and form-encoded data.

*   **URL:** `https://httpbin.org/post` (Testing mirror)
*   **Method:** `POST`
*   **Headers:** 
    ```text
    Content-Type: application/x-www-form-urlencoded
    Authorization: Basic dGVzdC1jbGllbnQ6dGVzdC1zZWNyZXQ=
    ```
*   **Body:** `grant_type=client_credentials&scope=read:all`

---

## 4. Intentional Error (401 Unauthorized)
Use this to test how the "Recent Failures" and "Analysis" sections handle 401 errors.

*   **URL:** `https://httpstat.us/401`
*   **Method:** `GET`
*   **Headers:** `Accept: text/plain`

---

## 5. GraphQL Sample (POST)
Use this to test querying data via JSON body payloads.

*   **URL:** `https://countries.trevorblades.com/`
*   **Method:** `POST`
*   **Headers:** `Content-Type: application/json`
*   **Body:**
    ```json
    {
      "query": "{ country(code: \"IN\") { name native emoji currency languages { name } } }"
    }
    ```
