namespace BookmarkHighlighter;

public class Highlighter
{
    public static void WriteGameJsFiles(Dictionary<string, List<string>> gameDict)
    {
        string templatePath = "GeneralGameTemplate.js";
        string outputPath = "Highlighter Extension/GameHighlighter.js";

        string template = File.ReadAllText(templatePath);

        using (StreamWriter writer = new StreamWriter(outputPath))
        {
            foreach (var key in gameDict.Keys)
            {
                string gameNameString = string.Join(", ", gameDict[key].Select(g => $"\"{g}\""));
                writer.WriteLine($"{key}=[{gameNameString}]\n\n");
            }

            writer.WriteLine(template);
        }
    }
}