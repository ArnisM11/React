import {Article} from "../types/Article";
export type ArticleFormProps = {
    article: Article;
    onSubmit: (title: string, description: string) => void;
  };