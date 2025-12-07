/**
 * Test data generator utility for restful-booker API
 */
export class TestDataGenerator {
  /**
   * Generate booking data for restful-booker
   */
  static generateBooking() {
    const firstnames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana'];
    const lastnames = ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown', 'Davis'];
    
    const checkin = new Date();
    checkin.setDate(checkin.getDate() + Math.floor(Math.random() * 30));
    const checkout = new Date(checkin);
    checkout.setDate(checkout.getDate() + Math.floor(Math.random() * 14) + 1);

    return {
      firstname: firstnames[Math.floor(Math.random() * firstnames.length)],
      lastname: lastnames[Math.floor(Math.random() * lastnames.length)],
      totalprice: Math.floor(Math.random() * 500) + 50,
      depositpaid: Math.random() > 0.5,
      bookingdates: {
        checkin: checkin.toISOString().split('T')[0],
        checkout: checkout.toISOString().split('T')[0]
      },
      additionalneeds: ['Breakfast', 'Lunch', 'Dinner', 'Parking', 'Wi-Fi'][Math.floor(Math.random() * 5)]
    };
  }

  /**
   * Generate auth credentials
   */
  static getAuthCredentials() {
    return {
      username: 'admin',
      password: 'password123'
    };
  }

  /**
   * Generate invalid booking data
   */
  static generateInvalidBooking() {
    return {
      firstname: '',
      lastname: '',
      totalprice: -100,
      depositpaid: 'invalid',
      bookingdates: {
        checkin: 'invalid-date',
        checkout: 'invalid-date'
      }
    };
  }

  /**
   * Generate random string
   */
  static randomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate partial booking update
   */
  static generatePartialBookingUpdate() {
    return {
      firstname: 'Updated',
      lastname: 'Name'
    };
  }
}
