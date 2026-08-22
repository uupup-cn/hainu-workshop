export interface ArtFileUploadSuccessPayload {
  file: Api.Files.FileAssetItem
  rawFile: File
  publicUrl?: string
  publicLink?: Api.Files.PublicLinkPayload
}
