using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistance.Migrations
{
    /// <inheritdoc />
    public partial class updateFkUnFavUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FavouriteUsers_Users_UserId",
                table: "FavouriteUsers");

            migrationBuilder.DropIndex(
                name: "IX_FavouriteUsers_UserId",
                table: "FavouriteUsers");

            migrationBuilder.CreateIndex(
                name: "IX_FavouriteUsers_FavUserId_UserId",
                table: "FavouriteUsers",
                columns: new[] { "FavUserId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FavouriteUsers_UserId_FavUserId",
                table: "FavouriteUsers",
                columns: new[] { "UserId", "FavUserId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_FavouriteUsers_Users_FavUserId",
                table: "FavouriteUsers",
                column: "FavUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_FavouriteUsers_Users_UserId",
                table: "FavouriteUsers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FavouriteUsers_Users_FavUserId",
                table: "FavouriteUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_FavouriteUsers_Users_UserId",
                table: "FavouriteUsers");

            migrationBuilder.DropIndex(
                name: "IX_FavouriteUsers_FavUserId_UserId",
                table: "FavouriteUsers");

            migrationBuilder.DropIndex(
                name: "IX_FavouriteUsers_UserId_FavUserId",
                table: "FavouriteUsers");

            migrationBuilder.CreateIndex(
                name: "IX_FavouriteUsers_UserId",
                table: "FavouriteUsers",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_FavouriteUsers_Users_UserId",
                table: "FavouriteUsers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
