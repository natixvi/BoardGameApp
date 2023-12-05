﻿namespace Domain.Entities;
public class MyBoardGame
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public virtual User User { get; set; }
    public int BoardGameId { get; set; }
    public virtual BoardGame BoardGame { get; set; }
    public double Rate { get; set; }
    public string? ReviewDescription { get; set; }
    public DateTime CreatedDate{ get; set; }
    public bool IsFavourite { get; set; } = false;
}