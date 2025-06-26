import type { IpDataInterface } from "../App";

interface InfoCardProps {
  ipData: IpDataInterface;
}

function InfoCard({ ipData }: InfoCardProps) {
  return (
    <div className="bg-white w-full rounded-2xl py-6 px-4 flex flex-col justify-center  items-center gap-6 md:flex-row md:justify-between md:px-8 max-w-100 md:max-w-280 lg:max-w-280 md:gap-0 md:items-stretch lg:py-8 shadow-2xl lg:mt-4">
      <div className="flex-item">
        <span className="label">IP Adress</span>
        <span className="value">{ipData.ipAddress}</span>
      </div>
      <div className="separator"></div>
      <div className="flex-item">
        <span className="label">Location</span>
        <span className="value">{ipData.location}</span>
      </div>
      <div className="separator"></div>
      <div className="flex-item">
        <span className="label">Timezone</span>
        <span className="value">{ipData.timeZone}</span>
      </div>
      <div className="separator"></div>
      <div className="flex-item">
        <span className="label">ISP</span>
        <span className="value">{ipData.isp}</span>
      </div>
    </div>
  );
}

export default InfoCard;
