import BaseTable from "../BaseTable";

export default function UsersTable(props) {
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
