from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.watchlist_person import WatchlistPerson
from app.models.watchlist_vehicle import WatchlistVehicle
from app.schemas.watchlist import (
    WatchlistPersonCreate,
    WatchlistPersonResponse,
    WatchlistPersonUpdate,
    WatchlistVehicleCreate,
    WatchlistVehicleResponse,
    WatchlistVehicleUpdate,
)

router = APIRouter(
    prefix="/api/v1/watchlist",
    tags=["Watchlist"],
)


# =========================
# PERSON WATCHLIST
# =========================

@router.post(
    "/persons",
    response_model=WatchlistPersonResponse,
    status_code=201,
)
def create_person(
    data: WatchlistPersonCreate,
    db: Session = Depends(get_db),
):
    person = WatchlistPerson(**data.model_dump())

    db.add(person)
    db.commit()
    db.refresh(person)

    return person


@router.get(
    "/persons",
    response_model=list[WatchlistPersonResponse],
)
def get_persons(db: Session = Depends(get_db)):
    return (
        db.query(WatchlistPerson)
        .order_by(WatchlistPerson.created_at.desc())
        .all()
    )


@router.get(
    "/persons/{person_id}",
    response_model=WatchlistPersonResponse,
)
def get_person(
    person_id: int,
    db: Session = Depends(get_db),
):
    person = (
        db.query(WatchlistPerson)
        .filter(WatchlistPerson.id == person_id)
        .first()
    )

    if not person:
        raise HTTPException(
            status_code=404,
            detail="Watchlist person not found",
        )

    return person


@router.put(
    "/persons/{person_id}",
    response_model=WatchlistPersonResponse,
)
def update_person(
    person_id: int,
    data: WatchlistPersonUpdate,
    db: Session = Depends(get_db),
):
    person = (
        db.query(WatchlistPerson)
        .filter(WatchlistPerson.id == person_id)
        .first()
    )

    if not person:
        raise HTTPException(
            status_code=404,
            detail="Watchlist person not found",
        )

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(person, field, value)

    db.commit()
    db.refresh(person)

    return person


@router.delete(
    "/persons/{person_id}",
    status_code=204,
)
def delete_person(
    person_id: int,
    db: Session = Depends(get_db),
):
    person = (
        db.query(WatchlistPerson)
        .filter(WatchlistPerson.id == person_id)
        .first()
    )

    if not person:
        raise HTTPException(
            status_code=404,
            detail="Watchlist person not found",
        )

    db.delete(person)
    db.commit()


# =========================
# VEHICLE WATCHLIST
# =========================

@router.post(
    "/vehicles",
    response_model=WatchlistVehicleResponse,
    status_code=201,
)
def create_vehicle(
    data: WatchlistVehicleCreate,
    db: Session = Depends(get_db),
):
    existing = (
        db.query(WatchlistVehicle)
        .filter(WatchlistVehicle.plate_number == data.plate_number)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Vehicle already exists in watchlist",
        )

    vehicle = WatchlistVehicle(**data.model_dump())

    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)

    return vehicle


@router.get(
    "/vehicles",
    response_model=list[WatchlistVehicleResponse],
)
def get_vehicles(db: Session = Depends(get_db)):
    return (
        db.query(WatchlistVehicle)
        .order_by(WatchlistVehicle.created_at.desc())
        .all()
    )


@router.get(
    "/vehicles/{vehicle_id}",
    response_model=WatchlistVehicleResponse,
)
def get_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
):
    vehicle = (
        db.query(WatchlistVehicle)
        .filter(WatchlistVehicle.id == vehicle_id)
        .first()
    )

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Watchlist vehicle not found",
        )

    return vehicle


@router.put(
    "/vehicles/{vehicle_id}",
    response_model=WatchlistVehicleResponse,
)
def update_vehicle(
    vehicle_id: int,
    data: WatchlistVehicleUpdate,
    db: Session = Depends(get_db),
):
    vehicle = (
        db.query(WatchlistVehicle)
        .filter(WatchlistVehicle.id == vehicle_id)
        .first()
    )

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Watchlist vehicle not found",
        )

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(vehicle, field, value)

    db.commit()
    db.refresh(vehicle)

    return vehicle


@router.delete(
    "/vehicles/{vehicle_id}",
    status_code=204,
)
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
):
    vehicle = (
        db.query(WatchlistVehicle)
        .filter(WatchlistVehicle.id == vehicle_id)
        .first()
    )

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Watchlist vehicle not found",
        )

    db.delete(vehicle)
    db.commit()