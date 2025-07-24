import BaseTable from "../BaseTable";
import { logClientError } from "../../services/logger";

export default function SeriesGenresTable(props) {
  if (props.error) {
    logClientError(
      "SeriesGenresTable",
      "Dizi türleri tablosu hatası",
      props.error,
      "mid"
    );
  }

  return (
    <BaseTable
      {...props}
      title="Dizi Türleri"
      columns={["SERIES_LINK", "GENRE"]}
      modalTitles={{ add: "Yeni Dizi Türü Ekle", edit: "Dizi Türünü Düzenle" }}
      keyField="SERIES_LINK"
    />
  );
}
