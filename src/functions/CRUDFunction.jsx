const url = process.env.REACT_APP_URL;
let token = localStorage.getItem("token");
let refreshToken = localStorage.getItem("refreshToken");

export const tokenRefresh = async (func, endp, data) => {
  const response = await postFunction("users/refreshToken", { refreshToken });
  if (response.token) {
    localStorage.setItem("token", response.token);
    localStorage.setItem("refreshToken", response.refreshToken);
    token = response.token;
    refreshToken = response.refreshToken;
    return await func(endp, data);
  } else {
    localStorage.clear();
    token = "";
    refreshToken = "";
  }
};

export const getFunction = async (endp) => {
  try {
    const response = token ? await fetch(url + endp, { headers: { Authorization: "Bearer " + token } }) : await fetch(url + endp);
    if (response.ok) {
      return await response.json();
    } else {
      const data = response.status === 401 && refreshToken && tokenRefresh(getFunction, endp);
      if (data) return data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const postFunction = async (endp, data) => {
  try {
    const response = await fetch(url + endp, {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }),
    });
    if (response.ok) {
      return await response.json();
    } else {
      if (response.status === 401 && refreshToken) {
        const refetch = tokenRefresh(postFunction, endp, data);
        if (refetch) return refetch;
      }

      return await response.text();
    }
  } catch (error) {
    console.log(error);
  }
};

export const putFunction = async (endp, data) => {
  try {
    const response = await fetch(url + endp, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }),
    });
    if (response.ok) {
      return await response.json();
    } else {
      if (response.status === 401 && refreshToken) {
        const refetch = tokenRefresh(putFunction, endp, data);
        if (refetch) return refetch;
      }
      return response.status === 400 ? await response.json() : await response.text();
    }
  } catch (error) {
    console.log(error);
  }
};
export const deleteFunction = async (endp) => {
  try {
    const response = await fetch(url + endp, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    if (response.ok) {
      return await response.json();
    } else {
      if (response.status === 401 && refreshToken) {
        const refetch = tokenRefresh(deleteFunction, endp);
        if (refetch) return refetch;
      }
      console.log(await response.text());
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};
