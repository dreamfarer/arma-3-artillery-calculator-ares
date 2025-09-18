export type MapMetadata = {
  tileSize: number;
  size: number[];
  devUrl: string;
  prodUrl: string;
  elevationDevUrl: string;
  elevationProdUrl: string;
  boundsData: number[];
  boundsImage: number[];
  minZoom: number;
  maxZoom: number;
  maxOverscaledZoom: number;
  initZoom: number;
  attribution: string;
};

export type MapMetadataRecord = Record<string, MapMetadata>;
