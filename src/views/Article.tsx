import React, {useEffect,useState} from "react";
import { useParams } from "react-router-dom";
import { Article as ArticleType } from "../types/Article";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { delay } from "../constants/delays";
import { Button } from "../components/Button";


export const Article = () => {
    const [article,setArticle] = useState<null | ArticleType>(null);
    const [isLoading,setIsLoading] = useState(false);
    const {articleId} = useParams<{articleId : string}>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () =>{
        try{
            setIsLoading(true);
            await delay(500);
            const {data} = await axios.get(`http://localhost:3004/articles/${articleId}`);
            setArticle(data);
            setIsLoading(false);
          }
          catch (error){
            console.log(error);
            setIsLoading(false);
          }
        };
        fetchData();
    },[articleId]);

    if(isLoading) {
        return <div> Loading...</div>
    }
    if(!article) {
        return <div>Article not found</div>
    }


    return (
    <article>
        <Button onButtonClick={() => {
            navigate(-1);
        }}> Back to articles </Button>
        <h2>{article.title}</h2>
        <p>{article.description}</p>
        <p>{article.id}</p>

    </article>
    )
};