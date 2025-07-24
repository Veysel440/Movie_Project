import BaseTable from "../BaseTable";
import { logClientError } from "../../services/logger";

export default function SeriesRatingsCommentsTable(props) {
  if (props.error) {
    logClientError(
      "SeriesRatingsCommentsTable",
      "Dizi yorumları ve puanları tablosu hatası",
      props.error,
      "mid"
    );
  }

  return (
    <BaseTable
      {...props}
      title="Dizi Yorumları ve Puanları"
      columns={["LINK", "EMAIL", "COMMENT", "RATING", "CREATED_AT"]}
      truncateFields={["COMMENT"]}
      modalTitles={{
        add: "Yeni Dizi Yorumu Ekle",
        edit: "Dizi Yorumunu Düzenle",
      }}
      keyField="LINK"
    />
  );
}
