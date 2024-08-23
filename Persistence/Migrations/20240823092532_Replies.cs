using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Replies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParentPostId",
                table: "ActivityPosts",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ActivityPosts_ParentPostId",
                table: "ActivityPosts",
                column: "ParentPostId");

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityPosts_ActivityPosts_ParentPostId",
                table: "ActivityPosts",
                column: "ParentPostId",
                principalTable: "ActivityPosts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActivityPosts_ActivityPosts_ParentPostId",
                table: "ActivityPosts");

            migrationBuilder.DropIndex(
                name: "IX_ActivityPosts_ParentPostId",
                table: "ActivityPosts");

            migrationBuilder.DropColumn(
                name: "ParentPostId",
                table: "ActivityPosts");
        }
    }
}
