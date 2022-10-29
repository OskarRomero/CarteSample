USE [Carte]
GO
/****** Object:  StoredProcedure [dbo].[Cart_Insert]    Script Date: 9/13/2022 10:49:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Oscar Romero>
-- Create date: <9/8/22>
-- Description: <A Proc to insert a record to dbo.Cart by Id
-- Code Reviewer:

-- MODIFIED BY: Oscar Romero
-- MODIFIED DATE:9/8/22
-- Code Reviewer:
-- Note:

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer: 
-- Note:
-- =============================================
CREATE proc [dbo].[Cart_Insert]
				 @MenuItemId int
				,@Quantity int
				,@CreatedBy int
				,@ModifiedBy int
				,@Id int OUTPUT

as
/* Test Code

		Declare  @Id int = 0

		Declare  @MenuItemId int = 36
				,@Quantity int = 2
				,@CreatedBy int = 1
				,@ModifiedBy int = 1

		Select * from dbo.Cart

		execute [dbo].[Cart_Insert]
				@MenuItemId
				,@Quantity
				,@CreatedBy
				,@ModifiedBy
				,@Id OUTPUT
		
		Select @Id

		Select * from dbo.Cart		
*/
BEGIN

	INSERT INTO [dbo].[Cart]
				 ([MenuItemId]
				 ,[Quantity]
				 ,[CreatedBy]
				 ,[ModifiedBy])
     VALUES
           (@MenuItemId
		   ,@Quantity
			,@CreatedBy
			,@ModifiedBy)

	SET @Id = SCOPE_IDENTITY()

END
/*truncate table dbo.cart*/
GO
