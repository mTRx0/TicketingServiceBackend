export class DataValidator {
  /**
  * Validates provided email
  * @public
  * @static
  * @param {string} email Email to validate
  * @returns {boolean} Indicates whether provided email is valid
  */
   public static validateEmail(email: string): boolean {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }
  
  /**
  * Validates provided password for correct hashing algorithm
  * @public
  * @static
  * @param {string} password Password to validate
  * @returns {boolean} Indicates whether provided password uses correct hashing algorithm
  */
  public static validatePassword(password: string): boolean {
    const sha256Regex = /^[a-f0-9]{64}$/gi;
    return sha256Regex.test(password);
  }

  /**
  * Validates provided full name
  * @public
  * @static
  * @param {string} given_name given name to validate
  * @param {string} family_name family name to validate
  * @returns {boolean} Indicates whether provided name is valid
  */
  public static validateName(given_name: string, family_name: string): boolean {
    const nameRegex = /^(([a-zA-ZäÄöÖüÜß]{2,15}){1}(\s([a-zA-ZäÄöÖüÜß]{2,15}))+)$/;
    return nameRegex.test(given_name + ' ' + family_name);
  }
  
  /**
  * Validates provided username
  * @public
  * @static
  * @param {string} username username to validate
  * @returns {boolean} Indicates whether provided username is valid
  */
  public static validateUsername(username: string): boolean {
    const usernameRegex = /[a-z]{6,32}/;
    return usernameRegex.test(username);
  }
}