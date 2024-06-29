namespace BookmarkHighlighter.JsWriters;

public class JsWriter : IJsWriter
{
    private readonly string _templatePath;
    private readonly string _outputPath;

    public JsWriter(string templatePath, string outputPath)
    {
        _templatePath = templatePath;
        _outputPath = outputPath;
    }

    public void Write(Dictionary<string, List<string>> links)
    {
        var template = File.ReadAllText(_templatePath);

        using var writer = new StreamWriter(_outputPath);
        foreach (var (key, games) in links)
        {
            var gameNameString = string.Join(", ", games.Select(g => $"\"{g}\""));
            writer.WriteLine($"const {key}=[{gameNameString}];\n");
        }

        writer.WriteLine(template);
    }
}