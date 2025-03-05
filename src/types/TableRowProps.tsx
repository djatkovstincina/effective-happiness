import { ListChildComponentProps } from "react-window";
import { User } from "./User";

export interface TableRowProps extends ListChildComponentProps {
  data: User[];
}
