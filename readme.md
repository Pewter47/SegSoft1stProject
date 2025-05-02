# OAuth2 Authentication Server Instructions (70357-70369)

---

## Endpoints

### User Registration

**POST** `https://auth-server-ss2425.onrender.com/api/users/register`

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

---

### Client Registration

**POST** `https://auth-server-ss2425.onrender.com/api/clients/register`

**Body:**
```json
{
  "clientID": "string",
  "clientSecret": "string",
  "name": "string",
  "redirectUri": "string"
}
```

---

### Authorization Process

**GET** `https://auth-server-ss2425.onrender.com/authorize`

**Query Parameters:**
- `client_id`: The client ID
- `redirect_uri`: The redirect URI
- `state`: (Optional) string

>Will prompt the user to fill a form with their username and password, submiting it performs the next request
---

**POST** `https://auth-server-ss2425.onrender.com/authorize/login`

**Body:**
```json
{
  "username": "username",
  "password": "password",
  "client_id": "The client ID",
  "redirect_uri": "The redirect URI",
  "state": "same as last state"
}
```
>Will redirect to the client app's redirect URI with the authentication code as a query parameter

### Token Generation

**POST** `https://auth-server-ss2425.onrender.com/token`

**Body:**
```json
{
  "client_id": "The client ID",
  "client_secret": "The client secret",
  "code": "the authorization code"
}
```
