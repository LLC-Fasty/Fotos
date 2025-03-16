import { supabase, supabase2 } from "@/lib/supabaseClient";
import { connectRustFun } from "./connectService";

const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;
export class Auth {
  constructor() {
    this.header = { alg: "LLC" };
    this.payload = {};
    this.expiry = null;
    this.encryptionKey = "mysecretencryptionkey";
  }
  base64ShuffleE(str) {
    const buffer = Buffer.from(str, "utf-8");
    return buffer.toString("base64");
  }

  base64ShuffleD(str) {
    const buffer = Buffer.from(str, "base64");
    return buffer.toString("utf-8");
  }
  customEncode(str) {
    let encoded = "";
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      const encryptedCharCode =
        charCode + this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
      encoded += String.fromCharCode(encryptedCharCode);
    }
    encoded = encoded.split("").reverse().join("");
    return btoa(encoded);
  }

  customDecode(encodedStr) {
    try {
      let decoded = "";
      let str = atob(encodedStr);
      str = str.split("").reverse().join("");

      for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        const decryptedCharCode =
          charCode -
          this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
        decoded += String.fromCharCode(decryptedCharCode);
      }
      return decoded;
    } catch (e) {
      return null;
    }
  }

  sign(data) {
    this.payload = { ...data };
    return this;
  }

  expiryAt(expiryString) {
    const now = new Date();
    let expiryTime = 0;

    if (expiryString.includes("h")) {
      const hours = parseInt(expiryString.split("h")[0]);
      expiryTime += hours * 60 * 60 * 1000;
    }
    if (expiryString.includes("m")) {
      const minutes = parseInt(expiryString.split("m")[0].split("h").pop());
      expiryTime += minutes * 60 * 1000;
    }
    if (expiryString.includes("s")) {
      const seconds = parseInt(expiryString.split("s")[0].split("m").pop());
      expiryTime += seconds * 1000;
    }
    this.expiry = new Date(now.getTime() + expiryTime);
    this.payload.exp = Math.floor(this.expiry.getTime() / 1000);
    return this;
  }

  generate(secret) {
    if (Object.keys(this.payload).length === 0) {
      throw new Error("Payload is empty. Use sign() to set the payload.");
    }

    if (this.expiry) {
      this.payload.exp = Math.floor(this.expiry.getTime() / 1000);
    } else {
      delete this.payload.exp;
    }

    const encodedHeader = this.customEncode(JSON.stringify(this.header));
    const encodedPayload = this.customEncode(JSON.stringify(this.payload));

    const signatureInput = encodedHeader + "." + encodedPayload;
    const signature = this.customEncode(signatureInput + secret);

    return encodedHeader + "." + encodedPayload + "." + signature;
  }

  verify(token, secret) {
    try {
      const [encodedHeader, encodedPayload, signature] = token.split(".");
      if (!encodedHeader || !encodedPayload || !signature) {
        return false;
      }

      const signatureInput = encodedHeader + "." + encodedPayload;
      const expectedSignature = this.customEncode(signatureInput + secret);

      if (signature !== expectedSignature) {
        return false;
      }

      const decodedPayloadString = this.customDecode(encodedPayload);
      if (!decodedPayloadString) return false;

      const decodedPayload = JSON.parse(decodedPayloadString);

      if (
        decodedPayload.exp &&
        decodedPayload.exp < Math.floor(Date.now() / 1000)
      ) {
        return false;
      }

      return decodedPayload;
    } catch (error) {
      return false;
    }
  }
}

class SupabaseFunc {
  async supaCheck(username) {
    try {
      // console.log("username: ", username);

      const { data: usernameexists, error: usernameexistsError } =
        await supabase.from("liphuser").select("*").eq("username", username);

      if (usernameexistsError) {
        // console.log(usernameexistsError);
        return { error: usernameexistsError.message };
      }

      // console.log(usernameexists);
      return { usernameexisists: usernameexists.length > 0 };
    } catch (err) {
      return { error: err.message };
    }
  }
  async supaCheckbyID(id) {
    try {
      // console.log("ID: ", id);

      const { data: idexists, error: idexistsError } = await supabase
        .from("liphuser")
        .select("id, username, created_at")
        .eq("id", id);

      if (idexistsError) {
        return { error: idexistsError.message };
      }

      return { userDetails: idexists };
    } catch (err) {
      return { error: err.message };
    }
  }
  async supaGatherImagesbyID(id) {
    try {
      // console.log("ID: ", id);

      const { data: idexists, error: idexistsError } = await supabase
        .from("liphimages")
        .select("*")
        .eq("userId", id);

      if (idexistsError) {
        return { error: idexistsError.message };
      }

      return { userImageDetails: idexists };
    } catch (err) {
      return { error: err.message };
    }
  }
  async findUser(username, password) {
    try {
      // console.log("username: ", username);

      const { data, error } = await supabase
        .from("liphuser")
        .select("id")
        .match({ username, password });

      if (error) {
        // console.log("Error fetching user:", error);
        return { error: error.message };
      }

      if (data && data.length > 0) {
        // console.log("User found:", data[0]);
        return { success: true, user: data[0].id };
      } else {
        // console.log("Invalid username or password");
        return { success: false, error: "Invalid username or password" };
      }
    } catch (err) {
      // console.error("Unexpected error:", err);
      return { error: err.message };
    }
  }

  async supaInsert(data, table) {
    if (!data) {
      return { error: "data Not available" };
    }
    if (data) {
      try {
        // console.log("in supainsert", data);

        const { data: idata, error: ierror } = await supabase
          .from(table)
          .insert(data)
          .select("id");

        if (ierror) {
          return { error: ierror.message };
        }
        // console.log(idata);
        return { success: true, userDetails: idata };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
  }
  async supaInsert2(jwts) {
    if (!jwts) {
      return { error: "data Not available" };
    }
    if (jwts) {
      try {
        // console.log("in supainsert", data);
        const { data: idata, error: ierror } = await supabase2
          .from("liphtxn")
          .insert({ jwts });

        if (ierror) {
          return { error: ierror.message };
        }
        // console.log(idata);
        return { success: true, userDetails: idata };
      } catch (err) {
        return { success: false, error: err };
      }
    }
  }

  async supaUpdate() {}

  async supaDelete(id) {
    try {
      const { data: deletedData, error: deleteError } = await supabase
        .from("liphimages")
        .delete()
        .eq("id", id);

      if (deleteError) {
        return { error: deleteError.message };
      }
      // console.log(deletedData);
      return { deleted: deletedData };
    } catch (err) {
      return { error: err.message };
    }
  }

  async supaUploadPhotos() {}

  async uploadImage(selectedImage, id) {
    try {
      // Get the image file from the selectedImage URL
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      // const fileName = `images/${id}-${Date.now()}.jpg`; // unique filename for the image

      // Determine the file extension and content type
      const extension = blob.type.split("/")[1]; // e.g., 'jpeg', 'png', 'svg+xml'
      const validExtensions = ["jpeg", "jpg", "png", "svg+xml"];

      if (!validExtensions.includes(extension)) {
        return {
          success: false,
          error:
            "Invalid file type. Only JPG, JPEG, PNG, and SVG are supported.",
        };
      }

      const fileName = `images/${id}-${Date.now()}.${
        extension === "svg+xml" ? "svg" : extension
      }`; // handle svg+xml

      // Upload image to the Supabase bucket
      const { data, error: uploadError } = await supabase.storage
        .from("liphmedia")
        .upload(fileName, blob, { contentType: "image/jpeg" });

      if (uploadError) {
        return { success: false, error: uploadError };
      }

      // Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from("liphmedia")
        .getPublicUrl(fileName);
      const imageUrl = publicUrlData.publicUrl;
      // console.log(imageUrl);

      // // Update the profileurl in the checkuser table
      // const { error: updateError } = await supabase
      //   .from("txnuser")
      //   .update({ profileimg: imageUrl })
      //   .eq("id", id);

      const liphimagedata = { userId: id, imageurl: imageUrl };
      const { data: insertedData, error: insertError } = await supabase
        .from("liphimages")
        .insert(liphimagedata)
        .select("id");

      if (insertError) {
        // console.log(insertError);
        return { success: false, error: insertError.message };
      }
      // console.log(insertedData);

      // if (updateError) {
      //   return { success: false, error: updateError };
      // }
      // console.log(imageUrl);

      return { success: true, imageUrl, transactionId: insertedData[0].id };
    } catch (error) {
      // console.log("Error uploading image:", error.message);
      return { success: false, error: error.message };
    }
  }
}

export const createAccount = async (userData) => {
  if (userData) {
    try {
      const supaObject = new SupabaseFunc();
      const authObject = new Auth();
      // console.log("userdata: ", userData);

      const operation = "encrypt";
      const {
        success: rsuccess,
        Result,
        error: rerror,
      } = await connectRustFun(userData.username, userData.password, operation);

      if (rerror) {
        return { error: rerror };
      }

      // console.log(Result);
      // console.log(`${typeof Result.username}`);
      const { usernameexisists, error: checkError } =
        await supaObject.supaCheck(Result.username);

      if (checkError) {
        // console.log(checkError);
        return { success: false, error: checkError };
      }

      if (usernameexisists) {
        // console.log(usernameexisists);
        return { success: false, error: "Username already exist" };
      }

      const uData = { username: Result.username, password: Result.password };
      // console.log(uData);

      const {
        success,
        userDetails,
        error: insertError,
      } = await supaObject.supaInsert(uData, "liphuser");

      if (insertError) {
        return { success: false, error: insertError };
      }
      if (success) {
        const payload = { id: userDetails[0].id };
        // console.log("payload", payload);
        const token = authObject.sign(payload).expiryAt("1h").generate(SECRET);
        // console.log("token", token);
        localStorage.setItem("token", token);

        const event = "account created";
        const logofAct = await userLogs(payload.id, event);
        // console.log("log:", logofAct);

        const event2 = "login";
        const logofAct2 = await userLogs(payload.id, event2);
        // console.log("log:", logofAct2);

        return {
          success: true,
          userDetails,
        };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  } else {
    return { success: false, error: "No Credentials Found. Try Again!" };
  }
};

export const findAccount = async (userData) => {
  try {
    const supaObject = new SupabaseFunc();
    const authObject = new Auth();
    // console.log("userdata: ", userData);

    const operation = "encrypt";
    const {
      success: rsuccess,
      Result,
      error: rerror,
    } = await connectRustFun(userData.username, userData.password, operation);

    if (rerror) {
      return { error: rerror };
    }

    const { success, user, error } = await supaObject.findUser(
      Result.username,
      Result.password
    );

    if (error) {
      // console.log(checkError);
      return { success: false, error };
    }

    if (success) {
      const payload = { id: user };
      const token = authObject.sign(payload).expiryAt("1h").generate(SECRET);
      // console.log("token", token);
      localStorage.setItem("token", token);

      const event = "login";
      const logofAct = await userLogs(payload.id, event);
      // console.log("log:", logofAct);

      return {
        success: true,
      };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const validLoginSession = async (token) => {
  try {
    const authObject = new Auth();
    const supaObject = new SupabaseFunc();

    const tokenValid = authObject.verify(token, SECRET);

    // console.log(tokenValid);

    if (!tokenValid) {
      return { situation: "Session Expired!" };
    }

    const { error, userDetails } = await supaObject.supaCheckbyID(
      tokenValid.id
    );
    if (error) {
      return { error };
    }

    const { error: imagegathererror, userImageDetails } =
      await supaObject.supaGatherImagesbyID(tokenValid.id);
    if (imagegathererror) {
      return { error: imagegathererror };
    }

    const operation = "decrypt";
    const {
      success: rsuccess,
      Result,
      error: rerror,
    } = await connectRustFun(userDetails[0].username, "", operation);

    if (rerror) {
      return { error: rerror };
    }
    const uname = Result.username;

    return { success: true, userData: userDetails[0], userImageDetails, uname };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export async function updateImg(selectedImage, id) {
  const authObject = new Auth();
  const supaObject = new SupabaseFunc();
  // console.log(id);
  if (!selectedImage) {
    return { success: false, error: "No image Present!" };
  }
  if (!id) {
    return { success: false, error: "No id Present!" };
  }
  if (selectedImage && id) {
    try {
      // console.log("user Details:", selectedImage, id);
      const { success, error, imageUrl, transactionId } =
        await supaObject.uploadImage(selectedImage, id);

      if (error) {
        return { success: false, error };
      }
      const payload = { transactionId, userId: id, task: "Image Upload" };
      // console.log("payload", payload);
      const jwts = authObject.sign(payload).generate(SECRET);
      // console.log("token", token4txn);

      const aa = await supaObject.supaInsert2(jwts);
      // console.log(aa);

      return { success: true, imageUrl };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export const DeleteImages = async (id, userId) => {
  try {
    const authObject = new Auth();
    const supaObject = new SupabaseFunc();
    const { error, deleted } = await supaObject.supaDelete(id);
    if (error) {
      return { success: false, error };
    }

    const payload = { transactionId: id, userId, task: "Image Delete" };
    // console.log("payload", payload);
    const jwts = authObject.sign(payload).generate(SECRET);
    // console.log("token", token4txn);

    const aa = await supaObject.supaInsert2(jwts);
    // console.log(aa);

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
export const GetImages = async (userId) => {
  try {
    const authObject = new Auth();
    const supaObject = new SupabaseFunc();
    const { error, userImageDetails } = await supaObject.supaGatherImagesbyID(
      userId
    );
    if (error) {
      return { success: false, error };
    }
    return { success: true, userImageDetails };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const userLogs = async (id, event) => {
  // console.log("logs...", id, event);
  if (!id) {
    return { error: "id not available" };
  }
  if (!event) {
    return { error: "id not available" };
  }
  if (id && event) {
    let userData;
    let device;
    try {
      let locDev = await this.fetchLoginInfo();
      // console.log(locDev);

      if (locDev.success) {
        locDev = locDev.info;

        device =
          locDev?.info?.device?.browser + ", " + locDev?.info?.device?.platform;
        if (device.includes("undefined")) {
          device = "Browser";
        }
        userData = { userId: id, event, region: locDev.location, device };
        // console.log(userData);
      }
      if (locDev.error) {
        userData = { userId: id, event };
        // console.log(userData);
      }
    } catch (err) {
      userData = { userId: id, event };
      // console.log(userData);
    }
    try {
      // console.log("in supainsert", userData);
      const { data: idata, error } = await supabase
        .from("liphlogs")
        .insert(userData)
        .select("id");

      if (error) {
        return { error };
      }
      // console.log(idata);
      return { success: true, data: idata };
    } catch (err) {
      return { success: false, error: err };
    }
  }
};
