export function isExistQueryStrings() {
  const param = new URLSearchParams(window.location.search);
  const mapiKey = param.get('mapiKey') || "";
  const redirectUrl = param.get('redirectTo') || "";
  return ( mapiKey !== "" );
}

export const loadData = async (targetUrl) => {
    const param = new URLSearchParams(window.location.search);
    const mapiKey = param.get('mapiKey') || "";
    const redirectUrl = param.get('redirectTo') || window.location.origin;

    let opts = {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        "MAPI-Key": mapiKey,
      },
    };

    try {
      const res = await fetch(redirectUrl + targetUrl, opts);
      const json = await res.json();
      return json;
    } catch (_) {
      return "";
    }
};

export const sendData = async (targetUrl, body, method = "PUT") => {
  const param = new URLSearchParams(window.location.search);
  const mapiKey = param.get('mapiKey') || "";
  const redirectUrl = param.get('redirectTo') || window.location.origin;

  let opts = {
    method: method,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      "MAPI-Key": mapiKey,
    },
    body: body,
  };

  try {
    const res = await fetch(redirectUrl + targetUrl, opts);
    const json = await res.json();
    return json;
  } catch (_) {
    return "";
  }
};

export const hasError = (response) => {
  if (!response) return true;
  if (response.error) return true;
  return false;
};


export const makeCombData = (value) => ({NAME: value.LCNAME + "(" + value.ANAL + ")", FACTOR: value.FACTOR});

export const updateCheckState = ((setFunction, array) => {setFunction(array)});

export const setStateUpdate = (setter, list) => {setter(list)};

export const makeObject = (value, postFix = "") => (value.map((value) => ({NAME: value + postFix, FACTOR: 1.0})));

export const processToken = ({name, token = "_", defaultValue = "0001"}) => {
  if (name.includes(token)) {
    const tokenLocation = name.lastIndexOf(token);
    const realName = name.substring(0, tokenLocation);
    let postFix = name.substring(tokenLocation + 1);
    if (postFix !== "" && !isNaN(Number(postFix))) {
      let padLeftResult = String(Number(postFix) + 1);
      postFix = padLeftResult.padStart(postFix.length, "0");

      return realName + token + postFix;
    }
  } 
  return name + token + defaultValue;
};
