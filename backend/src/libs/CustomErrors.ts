export class CustomErrors extends Error {
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class DatabaseErrors extends CustomErrors {
  constructor(message: string) {
    super(message, 500);
  }
}

export class ValidationError extends CustomErrors {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends CustomErrors {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class UnauthorizedError extends CustomErrors {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
  }
}
