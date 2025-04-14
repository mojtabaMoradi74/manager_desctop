const dateInMongoIdLength = 8,
  dateInMongoIdRadix = 16,
  msIsSec = 1000;

export function parseDateFromMongoId(id) {
  return new Date(
    parseInt(id.substring(0, dateInMongoIdLength), dateInMongoIdRadix) *
      msIsSec,
  );
}
