import BaseTable from "../BaseTable";
import { logClientError } from "../../services/logger";

export default function MovieRatingsCommentsTable(props) {
  if (props.error) {
    logClientError(
      "MovieRatingsCommentsTable",
      "Film yorumları ve puanları tablosu hatası",
      props.error,
      "mid"
    );
  }

  return (
    <BaseTable
      {...props}
      title="Film Yorumları ve Puanları"
      columns={["LINK", "EMAIL", "COMMENT", "RATING", "CREATED_AT"]}
      truncateFields={["COMMENT"]}
      modalTitles={{
        add: "Yeni Film Yorumu Ekle",
        edit: "Film Yorumunu Düzenle",
      }}
      keyField="LINK"
    />
  );
}
