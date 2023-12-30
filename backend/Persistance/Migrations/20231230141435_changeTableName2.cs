using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistance.Migrations
{
    /// <inheritdoc />
    public partial class changeTableName2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MyBoardGames_BoardGames_BoardGameId",
                table: "MyBoardGames");

            migrationBuilder.DropForeignKey(
                name: "FK_MyBoardGames_Users_UserId",
                table: "MyBoardGames");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MyBoardGames",
                table: "MyBoardGames");

            migrationBuilder.RenameTable(
                name: "MyBoardGames",
                newName: "UserBoardGames");

            migrationBuilder.RenameIndex(
                name: "IX_MyBoardGames_UserId",
                table: "UserBoardGames",
                newName: "IX_UserBoardGames_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_MyBoardGames_BoardGameId",
                table: "UserBoardGames",
                newName: "IX_UserBoardGames_BoardGameId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserBoardGames",
                table: "UserBoardGames",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserBoardGames_BoardGames_BoardGameId",
                table: "UserBoardGames",
                column: "BoardGameId",
                principalTable: "BoardGames",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserBoardGames_Users_UserId",
                table: "UserBoardGames",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserBoardGames_BoardGames_BoardGameId",
                table: "UserBoardGames");

            migrationBuilder.DropForeignKey(
                name: "FK_UserBoardGames_Users_UserId",
                table: "UserBoardGames");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserBoardGames",
                table: "UserBoardGames");

            migrationBuilder.RenameTable(
                name: "UserBoardGames",
                newName: "MyBoardGames");

            migrationBuilder.RenameIndex(
                name: "IX_UserBoardGames_UserId",
                table: "MyBoardGames",
                newName: "IX_MyBoardGames_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserBoardGames_BoardGameId",
                table: "MyBoardGames",
                newName: "IX_MyBoardGames_BoardGameId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MyBoardGames",
                table: "MyBoardGames",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MyBoardGames_BoardGames_BoardGameId",
                table: "MyBoardGames",
                column: "BoardGameId",
                principalTable: "BoardGames",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MyBoardGames_Users_UserId",
                table: "MyBoardGames",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
