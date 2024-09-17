class Helpers {
  static authHeaders = {
    headers: {
      "Content-Type": "application/json",
      "x-access-token": `${localStorage.getItem("token")}`,
    },
  };

  static authFileHeaders = {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-access-token": `${localStorage.getItem("token")}`,
    },
  };

  static getItem(key: string, isJson = false) {
    const item = localStorage.getItem(key);
    if (isJson && item) {
      try {
        return JSON.parse(item);
      } catch (e) {
        console.error(`Failed to parse ${key} from localStorage`, e);
        return null;
      }
    }
    return item;
  }

  static setItem(key: string, data: any, isJson = false) {
    try {
      if (isJson) {
        localStorage.setItem(key, JSON.stringify(data));
      } else {
        localStorage.setItem(key, data);
      }
    } catch (e) {
      console.error(`Failed to set ${key} in localStorage`, e);
    }
  }
}

export default Helpers;
