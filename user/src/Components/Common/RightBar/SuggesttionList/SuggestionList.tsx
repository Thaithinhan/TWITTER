import React from "react";
import "./SuggestionList.css";
import { SearchList } from "../../../../Types/type";

const SuggestionsList: React.FC<SearchList> = (prop: SearchList) => {
  const { searchWord } = prop;

  return (
    <div className="suggestions-list">
      {searchWord
        ? // Fake data. Thực tế có thể fetch từ API
          ["User 1", "User 2", "User 3"].map((user) => (
            <div key={user}>{user}</div>
          ))
        : "Enter Twitter username or fullname or email"}
    </div>
  );
};

export default SuggestionsList;
