SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Oscar Romero>
-- Description: <A Proc to select from dbo.Cart by CreatedBy or user Id>
-- Code Reviewer:

-- MODIFIED BY: Oscar Romero
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================
CREATE proc [dbo].[Cart_Select_ByCreatedBy]
				@CreatedBy int
as
/*              Test Code
		Declare @CreatedBy int = 1

		Execute [dbo].[Cart_Select_ByCreatedBy]
				@CreatedBy
*/
BEGIN
	--c=Cart mi=menuItem o=organizations l=location
	SELECT 
		 c.[Id] 
		,c.[MenuItemId]
		,c.[Quantity]
		,mi.Name as MenuItemName
		,mi.Description as MenuItemDescription
		,mi.ImageUrl
		,mi.UnitCost
		,mi.OrganizationId
		,o.Name as OrganizationName 
		,l.Id as LocationId
		,l.Zip as LocationZip
		,Ingredients = 
			(
			Select  i.Id
				,i.Name
				,i.ImageUrl
				,i.measure 
				,FoodWarningTypes = 
					(
					select fwt.Id
							,fwt.name
					from dbo.FoodWarningTypes as fwt 
					inner join dbo.IngredientWarnings as iw	on fwt.Id = iw.IngredientId 
					where iw.IngredientId = i.Id
					for JSON AUTO
					)
				,PurchaseRestrictions = 
					(
					Select pr.Id
							,pr.Name
					from dbo.PurchaseRestrictions as pr 
						inner join dbo.Ingredients as i	on i.RestrictionId = pr.Id 
						inner join dbo.MenuItemIngredients as mii on mii.IngredientId = i.Id
						where mii.CreatedBy = @CreatedBy
					for JSON AUTO
					)
			from dbo.Ingredients as i 
				inner join dbo.MenuItemIngredients as mii on i.Id = mii.IngredientId
				inner join dbo.MenuItems as mi on mii.MenuItemId = mi.Id
			where mi.Id = mii.MenuItemId AND i.IsInStock = 1 AND mi.IsDeleted = 0
			for JSON AUTO
		    )
		,FoodSafeTypes = 
			(
			SELECT
				 fst.Id
				,fst.Name
			FROM dbo.FoodSafeTypes as fst 
			inner join dbo.DietaryRestrictions as dr on dr.FoodSafeTypeId = fst.Id 
			inner join dbo.MenuItems as mi on mi.Id = dr.MenuItemId
			WHERE mi.CreatedBy = @CreatedBy
			For JSON AUTO								
			)
			  		  
	FROM [dbo].[Cart] as c 
	inner join dbo.MenuItems as mi on c.MenuItemId = mi.Id
	inner join dbo.Organizations as o on mi.OrganizationId = o.Id
	inner join dbo.Locations as l on o.PrimaryLocationId = l.Id 
		  
	Where c.CreatedBy = @CreatedBy

		
END
GO
