/**
 * Regular Expressions for form validation
 */
export const REGEX = {
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  mobile: /^[6-9]\d{9}$/,
  pincode: /^[1-9][0-9]{5}$/,
  city: /^[A-Za-z ]{2,50}$/,
  fullName: /^[A-Za-z ]{2,100}$/
};

/**
 * Validation utility functions
 * Returning an empty string means validation passed.
 * Returning a non-empty string means validation failed and contains the error message.
 */

export const validateEmail = (email: string): string => {
  if (!email) return "Email is required.";
  if (!REGEX.email.test(email)) return "Please enter a valid email address.";
  return "";
};

export const validateMobile = (mobile: string): string => {
  if (!mobile) return "Mobile number is required.";
  if (!REGEX.mobile.test(mobile)) return "Please enter a valid 10-digit mobile number.";
  return "";
};

export const validatePincode = (pincode: string): string => {
  if (!pincode) return "PIN code is required.";
  if (!REGEX.pincode.test(pincode)) return "Please enter a valid 6-digit Indian PIN code.";
  return "";
};

export const validateCity = (city: string): string => {
  if (!city) return "City is required.";
  if (!REGEX.city.test(city)) return "City should contain letters only.";
  return "";
};

export const validateFullName = (name: string): string => {
  if (!name) return "Full Name is required.";
  if (!REGEX.fullName.test(name)) return "Name should contain letters only.";
  return "";
};

export const validateAddressLine1 = (address: string): string => {
  if (!address) return "Address Line 1 is required.";
  if (address.length < 5) return "Address must be at least 5 characters.";
  if (address.length > 200) return "Address cannot exceed 200 characters.";
  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return "";
};

export interface PincodeDetails {
  city: string;
  state: string;
  district: string;
  localities: string[];
}

/**
 * Fetch location details from India Post API based on pincode
 * @param pincode 6-digit valid Indian pincode
 * @returns PincodeDetails or null if not found
 */
export const fetchLocationByPincode = async (pincode: string): Promise<PincodeDetails | null> => {
  if (!REGEX.pincode.test(pincode)) return null;

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();

    if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
      const postOffices = data[0].PostOffice;
      const firstOffice = postOffices[0];
      
      const localities = Array.from(new Set<string>(postOffices.map((office: any) => office.Name as string)));

      return {
        city: firstOffice.Block !== 'NA' ? firstOffice.Block : firstOffice.Region,
        district: firstOffice.District,
        state: firstOffice.State,
        localities: localities.sort()
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch pincode details", error);
    return null;
  }
};
