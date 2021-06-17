class MessageLine
{
    public string From { get; set; }
    public string Text { get; set; }
    public DateTime? When { get; set; }
}
static IEnumerable<MessageLine> ParseFile(string fileLocation)
{
    using (var reader = new StreamReader(fileLocation))
    {
        string lastUser = "<NULL>";
        while (!reader.EndOfStream)
        {
            var line = reader.ReadLine();
            if (string.IsNullOrWhiteSpace(line)) continue;
            var index = line.IndexOf('-');
            if (index != -1)
            {
                var dateStr = line.Substring(0, index);

                if (DateTime.TryParse(dateStr, out var dt))
                {
                    var index2 = line.IndexOf(':', index);
                    if (index2 != -1)
                    {
                        var from = line.Substring(index + 2, index2 - index - 2);
                        var text = line.Substring(index2 + 2);
                        lastUser = from;
                        yield return new MessageLine()
                        {
                            From = from,
                            Text = text,
                            When = dt
                        };
                        ;
                    }
                    else
                    {
                        //has datetime but no subject so this is a system line
                        var text = line.Substring(index + 1);
                        yield return new MessageLine()
                        {
                            From = "system",
                            Text = text,
                            When = dt
                        };
                        lastUser = "system";
                        ;
                    }
                }
                else
                {
                    yield return new MessageLine()
                    {
                        When = null,
                        Text = line,
                        From = lastUser
                    };
                    ;
                }
            }
            else
            {
                yield return new MessageLine()
                {
                    When = null,
                    Text = line,
                    From = lastUser
                };
                //
                ;
            }
        }
    }
    yield break;
}
