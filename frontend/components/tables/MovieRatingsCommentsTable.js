import BaseTable from "../BaseTable";

export default function MovieRatingsCommentsTable(props) {
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
