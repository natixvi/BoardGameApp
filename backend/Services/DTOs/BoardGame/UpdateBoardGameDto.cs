﻿namespace Services.DTOs.BoardGame;
public class UpdateBoardGameDto
{
    public string Name { get; set; }
    public string Publisher { get; set; }
    public string Description { get; set; }
    public string Players { get; set; }
    public int Age { get; set; }
    public string ImageUrl { get; set; }
}
