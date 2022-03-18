export enum ImageAction {
  retry = "retry",
  repeat = "repeat",
  retryWithProfile = "retry_with_profile",
}

export enum ImageTypo {
  PhotoCaption = "Glory to Ukraine! 🇺🇦",
  repeat = "Repeat with result",
  retry = "Retry with original",
  retryWithProfile = "Retry with profile picture",
  processing = "Image received. Processing...",
}

export enum ImageError {
  message_deleted = "Original message was deleted",
  no_user_photo = "No user photo. Try send me one!",
  no_photo = "No photo",
}
