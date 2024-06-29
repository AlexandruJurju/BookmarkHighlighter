namespace BookmarkHighlighter.JsWriters;

public class JsWriter : IJsWriter
{
    private readonly string _templatePath;

    public JsWriter(string templatePath)
    {
        _templatePath = templatePath;
    }

    public void Write()
    {
        var template = File.ReadAllText(_templatePath);
        Console.WriteLine(template);
    }
}