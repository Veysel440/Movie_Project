import BaseTable from "../BaseTable";
import { logClientError } from "../../services/logger";

export default function SeriesActorsTable(props) {
  if (props.error) {
    logClientError(
      "SeriesActorsTable",
      "Dizi oyuncuları tablosu hatası",
      props.error,
      "mid"
    );
  }

  return (
    <BaseTable
      {...props}
      title="Dizi Oyuncuları"
      columns={["SERIES_LINK", "ACTOR_NAME", "CHARACTER_NAME", "ACTOR_PHOTO"]}
      modalTitles={{
        add: "Yeni Dizi Oyuncusu Ekle",
        edit: "Dizi Oyuncusunu Düzenle",
      }}
      keyField="SERIES_LINK"
    />
  );
}
