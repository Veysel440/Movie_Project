import BaseTable from "../BaseTable";
import { logClientError } from "../../services/logger";

export default function UsersTable(props) {
  if (props.error) {
    logClientError(
      "UsersTable",
      "Kullanıcılar yönetimi tablosu hatası",
      props.error,
      "mid"
    );
  }

  return (
    <BaseTable
      {...props}
      title="Kullanıcılar Yönetimi"
      columns={["EMAIL", "NAME", "SURNAME", "USER_TYPE", "CREATED_AT"]}
      keyField="EMAIL"
      modalTitles={{ add: "Yeni Kullanıcı Ekle", edit: "Kullanıcıyı Düzenle" }}
      inputTypes={{ PASSWORD: "password" }}
    />
  );
}
