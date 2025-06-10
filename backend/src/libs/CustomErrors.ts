export class CustomErrors extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
  }
}

export class DatabaseErrors extends CustomErrors {
  constructor(message: string) {
    super(message, 500);
  }
}
