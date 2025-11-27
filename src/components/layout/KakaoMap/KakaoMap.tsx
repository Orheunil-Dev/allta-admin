import Image from "next/image";
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import { markerIcon } from "../../../../public/images";

declare global {
  interface Window {
    kakao: any;
  }
}

interface Props {
  lat: number;
  lng: number;
  address: string;
}

export const KakaoMap = ({ lat, lng, address }: Props) => {
  useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_APP_KEY ?? "",
    libraries: ["services"],
  });

  return (
    <Map
      level={4}
      center={{ lat, lng }}
      style={{ width: "326px", height: "186px" }}
    >
      <MapMarker
        position={{ lat, lng }}
        // image={{
        //   src: "/images/marker-icon.png",
        //   size: {
        //     width: 60,
        //     height: 60,
        //   },
        // }}
      />
    </Map>
  );
};
