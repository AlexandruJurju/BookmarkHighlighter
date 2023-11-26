using System.Text.RegularExpressions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace BookmarkHighlighter.Parsers;

public class GameParser
{
    // get a dictionary with <K: String game link category, Value: List<String> with all the links of all the games in that folder>
    public Dictionary<string, List<string>> GetLinks(string bookmarksFilePath)
    {
        string input = File.ReadAllText(bookmarksFilePath);
        StringReader reader = new StringReader(input);
        JsonReader jsonReader = new JsonTextReader(reader);

        JsonSerializer serializer = new JsonSerializer();
        var o = (JToken)serializer.Deserialize(jsonReader);
        // Chrome bookmark structure is this way root -> bookmark_bar -> children; 
        // children are all the existing folders
        var allFolders = o["roots"]["bookmark_bar"]["children"];
        // find the Games folder
        var gameFolder = allFolders.First(x => x["name"].ToString() == "Games");
        // get all the folders inside the games folder
        var gameSubFolders = gameFolder["children"];

        // Dictionary for the games, key is folder name; value is a list containing all the games in that folder
        Dictionary<string, List<string>> gamesDict = new Dictionary<string, List<string>>();
        foreach (var folder in gameSubFolders)
        {
            string folderName = folder["name"].ToString();
            string category;
            List<string> links = GetLinksFromFolder(folder);

            switch (folderName)
            {
                case "gWaiting":
                    category = "Waiting";
                    break;
                case "gEarly":
                    category = "Early";
                    break;
                default:
                    category = "Normal";
                    break;
            }

            if (gamesDict.ContainsKey(category))
            {
                gamesDict[category].AddRange(links);
            }
            else
            {
                gamesDict.Add(category, links);
            }
        }

        return gamesDict;
    }

    // recursive function that finds all the links inside a folder
    private List<string> GetLinksFromFolder(JToken folder)
    {
        List<string> links = new List<string>();

        // for each element in that folder
        foreach (var child in folder["children"])
        {
            // if the element is a link then add it to the list
            if (child["type"]?.ToString() == "url")
            {
                string game_url = child["url"].ToString();
                if (game_url.Contains("steampowered.com"))
                {
                    string game_name = ExtractGameNameFromURL(game_url);
                    links.Add(game_name);
                }
            }
            // if the element is a folder then recursively call the function to find all the links inside that folder
            else if (child["children"] != null)
            {
                // Recursively get links from inner folders
                links.AddRange(GetLinksFromFolder(child));
            }
        }

        return links;
    }

    private string ExtractGameNameFromURL(string url)
    {
        // Define a regular expression pattern to match the name part
        string pattern = @"/app/\d+/(.*?)/";

        // Use Regex.Match to find the match
        Match match = Regex.Match(url, pattern);
        // Check if a match was found and return the game name
        if (match.Success)
        {
            string gameName = match.Groups[1].Value;
            gameName = gameName.Replace("_", " ");
            // Replace multiple whitespaces with a single one
            gameName = string.Join(" ", gameName.Split());
            gameName = gameName.ToLower();
            return gameName;
        }
        else
        {
            throw new Exception("CANT FIND NAME");
        }
    }
}